<?php

namespace Tests\Unit;

use App\Services\DocumentRoutingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DocumentRoutingServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_find_initial_office_returns_null_when_no_rules()
    {
        $service = new DocumentRoutingService();
        $this->assertNull($service->findInitialOffice(null));
    }
}
